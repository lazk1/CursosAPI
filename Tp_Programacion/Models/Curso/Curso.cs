using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tp_Programacion.Models.Curso
{
    public class Curso
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string ImagenPortadaUrl { get; set; } = null!; 
        public bool IsActivo { get; set; } = true; 
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public string MaterialEscrito { get; set; } = null!; 
        public string VideoUrl { get; set; } = null!; 
        public List<string> PreguntasQuiz { get; set; } = new(); 
        public int PorcentajeAprobacion { get; set; } = 70;
    }
}
