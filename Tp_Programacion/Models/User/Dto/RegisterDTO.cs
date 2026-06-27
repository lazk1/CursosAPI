using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Tp_Programacion.Models.User.Dto
{
    public class RegisterDTO
    {
        [Required]
        [MinLength(2)]
        public string UserName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(8)]
        [PasswordPropertyText]
        public string Password { get; set; } = null!;

        [Required]
        [MinLength(8)]
        [PasswordPropertyText]
        public string ConfirmPassword { get; set; } = null!;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = null!;
    }
}
