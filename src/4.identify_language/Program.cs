using _4.identify_language.DTOs;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var englishDictionary = new[] {
    "the ", "and ", " is ", " in", "hello", "how", "what", "where", "when", "thanks", 
    " be", "that", " for", "you", "string", "number", " of ", " but ", "would", "their",
    " my "
};

var spanishDictionary = new[] {
    "el ", " y ", " es ", " en ", "mañana", "hola", "ñ", "á", "é", "í", "ó", "ú", "para", 
    " del", " las ", " los ", "texto", "numero", "¿", "porque ", "aunque", "siempre", "¡"
};

app.MapPost("/detect-language", ([FromBody] RequestTextDto requestTextDto) =>
{
    if (String.IsNullOrEmpty(requestTextDto.Text))
        return Results.BadRequest("The string is empty!");
    
    int englishCount = englishDictionary.Count(e => 
        requestTextDto.Text.Contains(e, StringComparison.OrdinalIgnoreCase));
    int spanishCount = spanishDictionary.Count(s => 
        requestTextDto.Text.Contains(s, StringComparison.OrdinalIgnoreCase));

    if (englishCount > 0 && spanishCount == 0)
        return Results.Ok("The language is english");

    else if (spanishCount > 0 && englishCount == 0)
        return Results.Ok("The language is spanish");
    
    else if (englishCount > 0 && spanishCount > 0)
        return Results.Ok("The language is spanglish");

    else 
        return Results.NotFound("Can't identify language");
    
})
.WithName("DetectLanguage")
.WithOpenApi();

app.Run();
