using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tp_Programacion.Migrations
{
    /// <inheritdoc />
    public partial class AddEsPagoToCurso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EsPago",
                table: "Cursos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EsPago",
                table: "Cursos");
        }
    }
}
