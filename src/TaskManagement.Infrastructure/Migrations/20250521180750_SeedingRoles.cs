using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TaskManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedingRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3dca8f33-ecf0-484f-a28b-ebd04e7247b6", "3dca8f33-ecf0-484f-a28b-ebd04e7247b6", "User", "USER" },
                    { "745b9f24-a569-4f1c-bc34-5d9911b2d644", "745b9f24-a569-4f1c-bc34-5d9911b2d644", "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3dca8f33-ecf0-484f-a28b-ebd04e7247b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "745b9f24-a569-4f1c-bc34-5d9911b2d644");
        }
    }
}
