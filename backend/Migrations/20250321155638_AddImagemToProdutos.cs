using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddImagemToProdutos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Cozinhas_CozinhaId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Supermercados_SupermercadoId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Transacoes");

            migrationBuilder.DropIndex(
                name: "IX_Users_CozinhaId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_SupermercadoId",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "PickupAddress",
                table: "Produtos",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ImagemUrl",
                table: "Produtos",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Imagem",
                table: "Produtos",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.CreateTable(
                name: "ItensCarrinho",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Quantidade = table.Column<int>(type: "INTEGER", nullable: false),
                    Preco = table.Column<double>(type: "REAL", nullable: false),
                    ImagemUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItensCarrinho", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CozinhaId",
                table: "Users",
                column: "CozinhaId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_SupermercadoId",
                table: "Users",
                column: "SupermercadoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Cozinhas_CozinhaId",
                table: "Users",
                column: "CozinhaId",
                principalTable: "Cozinhas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Supermercados_SupermercadoId",
                table: "Users",
                column: "SupermercadoId",
                principalTable: "Supermercados",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Cozinhas_CozinhaId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Supermercados_SupermercadoId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "ItensCarrinho");

            migrationBuilder.DropIndex(
                name: "IX_Users_CozinhaId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_SupermercadoId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Imagem",
                table: "Produtos");

            migrationBuilder.AlterColumn<string>(
                name: "PickupAddress",
                table: "Produtos",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "ImagemUrl",
                table: "Produtos",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.CreateTable(
                name: "Transacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CodigoVerificacao = table.Column<string>(type: "TEXT", nullable: false),
                    CozinhaId = table.Column<int>(type: "INTEGER", nullable: false),
                    DataTransacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ProdutoId = table.Column<int>(type: "INTEGER", nullable: false),
                    Tipo = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacoes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CozinhaId",
                table: "Users",
                column: "CozinhaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_SupermercadoId",
                table: "Users",
                column: "SupermercadoId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Cozinhas_CozinhaId",
                table: "Users",
                column: "CozinhaId",
                principalTable: "Cozinhas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Supermercados_SupermercadoId",
                table: "Users",
                column: "SupermercadoId",
                principalTable: "Supermercados",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
