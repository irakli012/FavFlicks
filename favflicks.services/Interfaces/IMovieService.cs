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
        Task<IEnumerable<Movie>> GetMovieListAsync();
        Task<Movie?> GetMovieByIdAsync(int id);
        Task AddAsync(Movie movie);
        Task UpdateAsync(Movie movie);
        Task DeleteAsync(int id);
    }
}
