namespace JanoMotorsApi.DTOs
{
    public class CreateUserInfoDto
    {
        public required string PhoneNumber { get; set; }
        public required string Firstname { get; set; }
        public required string Lastname { get; set; }
        public required DateOnly DateOfBirth { get; set; }
        public IFormFile? ProfileImage { get; set; }
        public required IFormFile IDFront { get; set; }
        public required IFormFile IDBack { get; set; }
        public required IFormFile LicenseFront { get; set; }
        public required IFormFile LicenseBack { get; set; }
    }
}
