namespace Tp_Programacion.Models.Curso.Dto
{
    public class CursosDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string ImagenPortadaUrl { get; set; } = null!;
        public bool IsActivo { get; set; }
        public bool EsPago { get; set; }
        public DateTime FechaCreacion { get; set; }
        public bool TieneAcceso { get; set; }
    }
}
