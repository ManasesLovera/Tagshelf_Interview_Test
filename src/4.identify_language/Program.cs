using _4.identify_language.DTOs;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

/*
Ok the approach I took for this problem was very easy, the largest the text and accuracy is better, since the dictionary is not that long,
in a real life task I would use an api or ai tool for this to get the best results, but since I'm not able to do that I just created two 
dictionaries for english and spanish, I searhed the most common words in both languages, if I found only for english, the response will be
english and the same for spanish, if I found for both I will send spanglish, and if it doesn't math I will send an error message.
*/

var englishDictionary = new[] {
    "the ", "and ", " is ", " in", "hello", "how", "what", "where", "when", "thanks", 
    " be", "that", " for", "you", "string", "number", " of ", " but ", "would", "their",
    " my "
};

var spanishDictionary = new[] {
    " el ", " y ", " es ", " en ", "mañana", "hola", "ñ", "á", "é", "í", "ó", "ú", "para", 
    " del ", " las ", " los ", "texto", "numero", "¿", "porque ", "aunque", "siempre", "¡",
    " la "
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