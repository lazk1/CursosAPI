using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tp_Programacion.Enums;
using Tp_Programacion.Models.Role.Dto;
using Tp_Programacion.Models.User.Dto;
using Tp_Programacion.Services;
using Tp_Programacion.Utils;

namespace Tp_Programacion.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status500InternalServerError)]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ResponseValidation), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserDTO>> Register([FromBody] RegisterDTO register)
        {
            try
            {
                var created = await _authService.Register(register);
                return Created("/api/auth/register", created);
            }
            catch (ErrorResponse ex)
            {
                return StatusCode((int)ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                ResponseMessage msg = new ResponseMessage(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, msg);
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseValidation), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginDTO login)
        {
            try
            {
                var res = await _authService.Login(login, HttpContext);
                return Ok(res);
            }
            catch (ErrorResponse ex)
            {
                return StatusCode((int)ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                ResponseMessage msg = new ResponseMessage(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, msg);
            }
        }

        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> Logout()
        {
            try
            {
                await _authService.Logout(HttpContext);
                return Ok();
            }
            catch (Exception ex)
            {
                ResponseMessage msg = new ResponseMessage(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, msg);
            }
        }

        [HttpPut("update-roles/{userId}")]
        [Authorize(Roles = ROLES.Admin)]
        [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseValidation), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDTO>> UpdateRolesToUser(int userId, [FromBody] UpdateRolesDTO rolesDTO)
        {
            try
            {
                var res = await _authService.UpdateRolesToUser(userId, rolesDTO.RoleIds);
                return Ok(res);
            }
            catch (ErrorResponse ex)
            {
                return StatusCode((int)ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                ResponseMessage msg = new ResponseMessage(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, msg);
            }
        }

        [HttpGet("health")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status200OK)]
        public ActionResult<ResponseMessage> Health()
        {
            ResponseMessage response = new("Todo ok");
            return Ok(response);
        }

        [HttpGet("check-auth")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult CheckAuth() => Ok();

        [HttpPut("generate-pwdtoken")]
        [Authorize]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseValidation), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GeneratePwdTokenToUser()
        {
            try
            {
                await _authService.GeneratePwdTokenToUser(HttpContext);
                ResponseMessage res = new("Success");
                return Ok(res);
            }
            catch (ErrorResponse ex)
            {
                return StatusCode((int)ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                ResponseMessage msg = new ResponseMessage(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, msg);
            }
        }

        [HttpGet("verify-pwdtoken")]
        [Authorize]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ResponseValidation), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ResponseMessage), StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GeneratePwdTokenToUser([FromQuery] int userId, [FromQuery] string token)
        {
            try
            {
                await _authService.VerifyUserPwdToken(userId, token);
                ResponseMessage res = new("Success");
                return Ok(res);
            }
            catch (ErrorResponse ex)
            {
                return StatusCode((int)ex.StatusCode, ex.Message);
            }
            catch (Exception ex)
            {
                ResponseMessage msg = new ResponseMessage(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, msg);
            }
        }
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDTO>> Me()
        {
            try
            {
                var user = await _authService.GetAuthenticatedUser(HttpContext);
                return Ok(user);
            }
            catch (ErrorResponse ex)
            {
                return StatusCode((int)ex.StatusCode, ex.Message);
            }
        }
    }
}
