package Servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import addContact.addContactDao;
@WebServlet("/AddServlet")
public class AddServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public AddServlet() {
        super();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        String action = request.getParameter("action");
        response.sendRedirect("/AddUser/addContact.html");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userId = request.getParameter("userId");

        boolean addResult = addContactDao.addFriends(userId);

        if (addResult) {
            response.sendRedirect("/AddUser/addSuccess.html");
        } else {
            response.sendRedirect("/AddUser/userIDdoNotExist.html");
        }
    }
}
