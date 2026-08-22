namespace Dayflow.Backend.Models
{
    public class MoodEntry
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Mood { get; set; } = "Good"; // Great, Good, Neutral, Stressed, Exhausted
        public int EnergyScore { get; set; } = 8; // 1-10
        public string Remarks { get; set; } = string.Empty;

        // Navigation
        public User? User { get; set; }
    }
}
