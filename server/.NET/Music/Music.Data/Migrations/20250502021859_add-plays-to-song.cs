﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Music.Data.Migrations
{
    /// <inheritdoc />
    public partial class addplaystosong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Plays",
                table: "Songs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Plays",
                table: "Songs");
        }
    }
}
