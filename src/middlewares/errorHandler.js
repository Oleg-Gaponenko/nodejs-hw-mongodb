export default function errorHandler(error, request, response, next) {
    response.status(500).json({
            status: 500,
            message: "Something went wrong",
            data: error.message,
        });
}
