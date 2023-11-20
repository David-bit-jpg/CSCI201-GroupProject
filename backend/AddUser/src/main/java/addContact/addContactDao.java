package addContact;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class addContactDao {
    public static boolean addFriends(String userId) {
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/groupProgect", "root", "Jiwle2000000078");

            String checkUserExistsQuery = "SELECT count(*) FROM groupProgect.testTable WHERE userId=?";
            ps = conn.prepareStatement(checkUserExistsQuery);
            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                rs.close();
                ps.close();

                // Check if the user is already in the Friendtable
                String checkFriendExistsQuery = "SELECT count(*) FROM groupProgect.friendTable WHERE userID=?";
                ps = conn.prepareStatement(checkFriendExistsQuery);
                ps.setString(1, userId);
                rs = ps.executeQuery();

                if (rs.next() && rs.getInt(1) > 0) {
                    rs.close();
                    ps.close();
                    return false; // User is already a friend
                }

                // Add the user to the Friendtable
                String addFriendQuery = "INSERT INTO groupProgect.friendTable (userNumber, userID) VALUES (?, ?)";
                ps = conn.prepareStatement(addFriendQuery);
                ps.setInt(1, getUserNumber(userId));
                ps.setString(2, userId);

                int rowsAffected = ps.executeUpdate();

                rs.close();
                ps.close();
                return rowsAffected > 0;
            } else {
                rs.close();
                ps.close();
                return false; // User does not exist in testTable
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static int getUserNumber(String userId) {
        // 根据 userId 查询对应的 userNumber，这里你需要根据你的表结构和业务逻辑进行实现
        // 以下是一个示例，实际情况可能需要更复杂的查询逻辑
        // 这里假设 testTable 中有 userNumber 和 userID 两列
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/groupProgect", "root", "Jiwle2000000078");

            String getUserNumberQuery = "SELECT userNumber FROM groupProgect.testTable WHERE userID=?";
            ps = conn.prepareStatement(getUserNumberQuery);
            ps.setString(1, userId);
            rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getInt("userNumber");
            } else {
                return 0; // 默认值，表示未找到对应的 userNumber
            }
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // 发生异常，返回默认值
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (ps != null) {
                    ps.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
