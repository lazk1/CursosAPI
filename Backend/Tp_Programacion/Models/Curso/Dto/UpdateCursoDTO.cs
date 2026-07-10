using System.ComponentModel.DataAnnotations;

namespace Tp_Programacion.Models.Curso.Dto
{
    public class UpdateCursoDTO
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        public string Titulo { get; set; } = null!;

        [Required]
        [MinLength(10)]
        [MaxLength(500)]
        public string Descripcion { get; set; } = null!;

        [Required]
        [Url(ErrorMessage = "Debe ingresar una URL válida.")]
        public string ImagenPortadaUrl { get; set; } = null!;

        public bool IsActivo { get; set; }

        // El admin puede cambiar si el curso es de pago o gratuito.
        public bool EsPago { get; set; }

        [Required]
        public string MaterialEscrito { get; set; } = null!;

        [Required]
        [Url(ErrorMessage = "Debe ingresar una URL válida.")]
        public string VideoUrl { get; set; } = null!;

        public List<string> PreguntasQuiz { get; set; } = new();

        [Required]
        [Range(1, 100)]
        public int PorcentajeAprobacion { get; set; }
    }
}
