namespace JanoMotorsApi.DTOs
{
    public class CarFilterDto
    {
        public List<string>? Makes { get; set; } 
        public int? MinYear { get; set; } 
        public int? MaxYear { get; set; }
        public int? MinPrice { get; set; } 
        public int? MaxPrice { get; set; }
        public string? Transmission { get; set; }
    }
}
