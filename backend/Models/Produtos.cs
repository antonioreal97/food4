using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;
using Supermercado = backend.Models.Supermercado;

namespace backend.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime DataVencimento { get; set; }
        public double Desconto { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ImagemUrl { get; set; }
        public string? PickupAddress { get; set; }
        public int SupermercadoId { get; set; }
        [ForeignKey("SupermercadoId")]
        [ValidateNever] // Evita a validação automática dessa propriedade
        [JsonIgnore] // Ignora durante a desserialização
        public Supermercado? Supermercado { get; set; }
    }
}
