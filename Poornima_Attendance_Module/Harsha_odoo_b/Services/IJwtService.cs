using Dayflow.Backend.Models;

namespace Dayflow.Backend.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
