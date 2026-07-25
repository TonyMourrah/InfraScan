using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InfraScan.Migrations
{
    /// <inheritdoc />
    public partial class AjoutAuditActifsV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreePar",
                table: "Actifs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreation",
                table: "Actifs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateModification",
                table: "Actifs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModifiePar",
                table: "Actifs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreePar",
                table: "Actifs");

            migrationBuilder.DropColumn(
                name: "DateCreation",
                table: "Actifs");

            migrationBuilder.DropColumn(
                name: "DateModification",
                table: "Actifs");

            migrationBuilder.DropColumn(
                name: "ModifiePar",
                table: "Actifs");
        }
    }
}
