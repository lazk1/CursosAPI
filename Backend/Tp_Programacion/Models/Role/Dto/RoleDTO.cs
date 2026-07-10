using System.ComponentModel.DataAnnotations;

namespace Tp_Programacion.Models.Role.Dto
{
    public class RoleDTO
    {
        [Required]
        public string Name { get; set; } = null!;
    }
}
