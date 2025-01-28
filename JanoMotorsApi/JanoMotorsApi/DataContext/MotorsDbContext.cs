using JanoMotorsApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace JanoMotorsApi.DataContext
{
    public class MotorsDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserInfo> UserInfos { get; set; }
        public DbSet<UserDoc> UserDocs { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarInfo> CarInfos { get; set; }
        public DbSet<CarDoc> CarDocs { get; set; }
        public DbSet<PaymentDoc> PaymentDocs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder
                .ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Car>()
                .HasOne(c => c.CarInfo)
                .WithOne(ci => ci.Car)
                .HasForeignKey<CarInfo>(ci => ci.Id);

            modelBuilder.Entity<User>()
                .HasOne(u => u.UserInfo)
                .WithOne(ui => ui.User)
                .HasForeignKey<UserInfo>(ui => ui.Id);

            modelBuilder.Entity<Role>()
                .HasData(new Role { Id = 1, Name = "user" }, new Role { Id = 2, Name = "admin" });

            modelBuilder.Entity<User>()
                .HasData(
                    new User { Id = 1, Email = "janomotors.rental@gmail.com", Password = BCrypt.Net.BCrypt.HashPassword("13Toko30!"), RoleId = 2 },
                    new User { Id = 2, Email = "test@gmail.com", Password = BCrypt.Net.BCrypt.HashPassword("Test123") }

                );

            base.OnModelCreating(modelBuilder);
        }
    }
}
