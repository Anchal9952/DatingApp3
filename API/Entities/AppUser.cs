using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class AppUser
    {
        public int Id{get;set;}

        [Required]
        public string UserName{get;set;}

        [Required]
        public byte[] PasswordHash{get;set;}

        public byte[] PasswordSalt{get;set;}
    }
}