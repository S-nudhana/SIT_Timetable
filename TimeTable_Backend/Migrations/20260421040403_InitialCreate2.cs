using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimeTable_Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Timeline");

            migrationBuilder.DropColumn(
                name: "Place",
                table: "Timeline");

            migrationBuilder.RenameColumn(
                name: "Speaker",
                table: "Timeline",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "CoverImagePath",
                table: "Event",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "BannerImagePath",
                table: "Event",
                newName: "Description");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Timeline",
                newName: "Speaker");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Event",
                newName: "CoverImagePath");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Event",
                newName: "BannerImagePath");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "Timeline",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Place",
                table: "Timeline",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
