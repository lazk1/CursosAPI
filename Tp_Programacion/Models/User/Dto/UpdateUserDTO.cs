using System.ComponentModel.DataAnnotations;

namespace Tp_Programacion.Models.User.Dto
{
    public class UpdateUserDTO
    {
        [MinLength(2)]
        public string? UserName { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Phone]
        public string? PhoneNumber { get; set; }
    }
}
