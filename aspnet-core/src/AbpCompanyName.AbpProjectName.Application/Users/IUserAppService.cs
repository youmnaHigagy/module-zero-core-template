using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AbpCompanyName.AbpProjectName.Roles.Dto;
using AbpCompanyName.AbpProjectName.Users.Dto;

namespace AbpCompanyName.AbpProjectName.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, GetAllUserInput, CreateUserDto, UserDto>
    {
        Task<ListResultDto<RoleDto>> GetRoles();
        //PagedResultDto<UserDto> GetAll2(PagedResultSearchRequestDto input);
    }
}