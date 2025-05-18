using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Music.Data.Migrations
{
    /// <inheritdoc />
    public partial class addcolumnlycrsis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Lyrics",
                table: "Songs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lyrics",
                table: "Songs");
        }
    }
}
