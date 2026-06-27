using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Tp_Programacion.Models.User.Dto
{
    public class LoginDTO
    {
        [Required]
        [MinLength(2)]
        public string UsernameOrEmail { get; set; } = null!;

        [Required]
        [MinLength(8)]
        [PasswordPropertyText]
        public string Password { get; set; } = null!;
    }
}
