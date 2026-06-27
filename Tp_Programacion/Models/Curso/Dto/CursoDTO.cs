namespace Tp_Programacion.Models.Curso.Dto
{
    public class CursoDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string ImagenPortadaUrl { get; set; } = null!;
        public bool IsActivo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string MaterialEscrito { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public List<string> PreguntasQuiz { get; set; } = new();
        public int PorcentajeAprobacion { get; set; }
    }
}
