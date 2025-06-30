using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using favflicks.data.Models;

namespace favflicks.services.Interfaces
{
    public interface IMovieService
    {
        Task<IEnumerable<Movie>> GetMovieListAsync(string userId);
        Task<Movie?> GetMovieByIdAsync(int id, string userId);
        Task AddAsync(Movie movie);
        Task UpdateAsync(Movie movie);
        Task DeleteAsync(int id);
    }
}
