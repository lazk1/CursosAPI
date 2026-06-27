namespace Tp_Programacion.Models.User.Dto
{
    public class LoginResponseDTO
    {
        public string Token { get; set; } = null!;
        public UserDTO User { get; set; } = null!;
    }
}
