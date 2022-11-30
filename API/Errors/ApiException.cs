using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public interface IApiException
    {
        int StatusCode { get; set; }
        string Message { get; set; }
        string Details { get; set; }
    }

    public class ApiException : IApiException
    {
        public ApiException(int statusCode, string message, string details)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }

        public string Message { get; set; }

        public string Details { get; set; }
    }
}