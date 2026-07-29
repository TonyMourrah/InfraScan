using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using Xunit;

namespace InfraScan.Tests
{
    public class SecuriteApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public SecuriteApiTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetActifs_SansToken_RetourneUnauthorized()
        {
            var reponse = await _client.GetAsync("/api/actifs");
            Assert.Equal(HttpStatusCode.Unauthorized, reponse.StatusCode);
        }

        [Fact]
        public async Task GetActifs_AvecTokenInvalide_RetourneUnauthorized()
        {
            _client.DefaultRequestHeaders.Add("Authorization", "Bearer token-invalide-123");
            var reponse = await _client.GetAsync("/api/actifs");
            Assert.Equal(HttpStatusCode.Unauthorized, reponse.StatusCode);
        }
    }
}