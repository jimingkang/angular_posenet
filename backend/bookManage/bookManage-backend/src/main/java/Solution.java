import java.util.*;
import java.util.List;
//CLASS BEGINS, THIS CLASS IS REQUIRED
public class Solution
{   
	public static void main(String[] args) {
		List<Character> inputList=new ArrayList<Character>();
		//lengthEachScene()
	}
 // METHOD SIGNATURE BEGINS, THIS METHOD IS REQUIRED
 static List<Integer> lengthEachScene(List<Character> inputList)
 {
    int lastIndex[] = new int[128];
 for (int i = 0; i < inputList.size(); ++i)
   lastIndex[inputList.get(i)] = i;
 List<Integer> ans = new ArrayList<>();
 int start = 0;
 int end = 0;
 for (int i = 0; i < inputList.size(); ++i) {
   end = Math.max(end, lastIndex[inputList.get(i)]);
   if (i == end) {
     ans.add(end - start + 1);
     start = end + 1;
   }
 }
 return ans;
 }
 // METHOD SIGNATURE ENDS
}