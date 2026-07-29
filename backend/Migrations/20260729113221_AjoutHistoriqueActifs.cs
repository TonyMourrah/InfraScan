using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraScan.Migrations
{
    /// <inheritdoc />
    public partial class AjoutHistoriqueActifs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Actifs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActifHistoriques",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActifId = table.Column<int>(type: "int", nullable: false),
                    EtatSante = table.Column<int>(type: "int", nullable: false),
                    DateEnregistrement = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiePar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActifHistoriques", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActifHistoriques");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Actifs");
        }
    }
}
