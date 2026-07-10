using System.Net;

namespace Tp_Programacion.Utils
{
    public class ErrorResponse : Exception
    {
        public ResponseMessage Message { get; }
        public HttpStatusCode StatusCode { get; set; }

        public ErrorResponse(HttpStatusCode code, string msg) : base(msg)
        {
            Message = new ResponseMessage(msg);
            StatusCode = code;
        }
    }
}
