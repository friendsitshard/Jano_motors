namespace JanoMotorsApi.DTOs
{
    public class UserInfoUpdateDto
    {
        public required string PhoneNumber { get; set; }
        public required string Firstname { get; set; }
        public required string Lastname { get; set; }
        public required DateOnly DateOfBirth { get; set; }
    }
}
