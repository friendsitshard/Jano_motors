using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JanoMotorsApi.Migrations
{
    /// <inheritdoc />
    public partial class Two : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$H1FU8Va.lJtCke1EzIjlcuJ3NtuxLZ1hiSlWOP0KfB1IH.g1nsCam");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$POKQcyZ1GOiGX7J2sOjOiemHilddnOhn/5XaLgGdYieEiDkVNdCkq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Password",
                value: "$2a$11$pvj1ybJDQIhYYSQkkXBdlOyd1zTBasey6Nmc1rgWnWit4C5TTCscm");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "Password",
                value: "$2a$11$sBx6qcgy76K4DerJXhNTSOc8JpCeNpGceN0jMqAWFIr8QVk1Ks4vq");
        }
    }
}
