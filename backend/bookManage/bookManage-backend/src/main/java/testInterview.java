
public class testInterview {

	public static void main(String[] args) {
		int [] arr=new int[] {10,39,20,15,30,42,60,5,56,23,29,43};
		
		System.out.println(arr[0]);

	      
	}
	static int find3rdLargestNumber(int[] arr) {
		int [] subarr=new int[3]; //39,20,10
		subarr[0]=arr[0];
		subarr[1]=arr[1];
		subarr[2]=arr[2];
		for(int i=2;i<arr.length-2;i++) {
			if(subarr[0]<arr[i+1])
			{
				subarr[0]=arr[i+1];
				if(subarr[1]<arr[i+1])
					subarr[1]=arr[i+1];
				if(subarr[2]<arr[i+1])
					subarr[2]=arr[i+1];
				
			}
			
			
		}
		arr=subarr;
		
		return 0;

    }


}
