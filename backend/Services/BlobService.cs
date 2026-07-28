using Azure.Storage.Blobs;

namespace InfraScan.Services
{
    public class BlobService
    {
        private readonly BlobContainerClient _containerClient;

        public BlobService(IConfiguration configuration)
        {
            var connectionString = configuration["AzureStorage:ConnectionString"];
            var containerName = configuration["AzureStorage:ContainerName"];

            var blobServiceClient = new BlobServiceClient(connectionString);
            _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }

        public async Task<string> UploaderImageAsync(IFormFile fichier)
        {
            
            var nomFichier = $"{Guid.NewGuid()}{Path.GetExtension(fichier.FileName)}";

            var blobClient = _containerClient.GetBlobClient(nomFichier);

            using (var stream = fichier.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, overwrite: true);
            }

            return blobClient.Uri.ToString();
        }

        public async Task SupprimerImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            var nomFichier = Path.GetFileName(new Uri(imageUrl).LocalPath);
            var blobClient = _containerClient.GetBlobClient(nomFichier);
            await blobClient.DeleteIfExistsAsync();
        }
    }
}