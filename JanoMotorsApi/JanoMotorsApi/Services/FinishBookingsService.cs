using JanoMotorsApi.DataContext;
using Microsoft.EntityFrameworkCore;

namespace JanoMotorsApi.Services
{
    public class FinishBookingsService(IServiceProvider serviceProvider) : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<MotorsDbContext>();
                    await UpdateBookingStatuses(dbContext);
                }

                await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
            }
        }

        private async Task UpdateBookingStatuses(MotorsDbContext dbContext)
        {
            var now = DateTime.UtcNow;

            var bookingsToUpdate = await dbContext.Bookings
                .Where(b => b.EndDate <= now && b.Status == "active")
                .ToListAsync();

            if (bookingsToUpdate.Count != 0)
            {
                foreach (var booking in bookingsToUpdate)
                {
                booking.Status = "finished";
                }

                await dbContext.SaveChangesAsync();
            }
        }
    }
}
