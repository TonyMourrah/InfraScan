using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraScan.Migrations
{
    /// <inheritdoc />
    public partial class AjoutColonneVille : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ville",
                table: "Actifs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ville",
                table: "Actifs");
        }
    }
}
