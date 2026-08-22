using System.Text;
using Dayflow.Backend.Data;
using Dayflow.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure SQLite Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Data Source=dayflow.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// Register JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

// Configure JWT Authentication
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "DayflowSuperSecretKeyForHackathon2026WithHighEntropy123!";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "DayflowHRMS";
var audience = builder.Configuration["Jwt:Audience"] ?? "DayflowUsers";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Dayflow HRMS API v1");
    c.RoutePrefix = "swagger";
});

// Ensure Database Created & Seeded
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
    dbContext.SeedInitialData();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("=================================================");
Console.WriteLine("🚀 Dayflow HRMS Backend running on http://localhost:7070");
Console.WriteLine("📘 Swagger UI available at http://localhost:7070/swagger");
Console.WriteLine("=================================================");

app.Run("http://localhost:7070");
