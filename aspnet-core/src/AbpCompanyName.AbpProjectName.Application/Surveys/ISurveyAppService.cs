using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using AbpCompanyName.AbpProjectName.Surveys.Dto;

namespace AbpCompanyName.AbpProjectName.Surveys
{
	public interface ISurveyAppService : IFilteredAppService<SurveyDto, Guid, FilteredResultRequestDto>
	{
		
	}
}