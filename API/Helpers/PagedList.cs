// using System.Data.Entity;


using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count,int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int) Math.Ceiling(count /(double) pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public async static  Task<PagedList<T>> CreateAsync(IQueryable<T> source,
         int pageNumber,int pageSize)
         {
            // var abc = await source.AnyAsync();
            var count =await source.CountAsync();
            var items = await source.Skip((pageNumber -1)* pageSize).Take(pageSize).ToListAsync();
            PagedList<T> pagedlist = new PagedList<T>(items,count,pageNumber,pageSize);
            
            return pagedlist;
         }
    }
}