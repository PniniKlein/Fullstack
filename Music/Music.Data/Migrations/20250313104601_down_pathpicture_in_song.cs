using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Music.Data.Migrations
{
    /// <inheritdoc />
    public partial class down_pathpicture_in_song : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PathPicture",
                table: "Songs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PathPicture",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
