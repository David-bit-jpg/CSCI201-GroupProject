

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:3001"); // Replace with your React app's origin
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        String nodeServerUrl = "http://localhost:3000/api/createGuest"; // Update with your Node.js server URL
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(nodeServerUrl))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        // Send the request and receive the response
        HttpResponse<String> httpResponse;
		try {
	        response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");

			httpResponse = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
			int responseCode = httpResponse.statusCode();
	        System.out.println("Response Code: " + responseCode);
	        // Set the content type before writing to the response
	        Gson gson = new Gson();
	        // Write the JSON response to the client
			response.setStatus(HttpServletResponse.SC_OK);
			System.out.print(response.getStatus());
			String body = httpResponse.body();
	        response.getWriter().write(body);
	        System.out.println(httpResponse.body());
	        response.getWriter().flush();
		} catch (IOException | InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

        // Check the HTTP response code
        
       }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	  @Override
	    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
	            throws ServletException, IOException {
	        handleCORS(response);
	        response.setStatus(HttpServletResponse.SC_OK);
	    }
	  private void handleCORS(HttpServletResponse response) {
	        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
	        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	        response.setHeader("Access-Control-Max-Age", "3600");
	    }

}
