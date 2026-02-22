class Solution {
public:

    bool isPossible(vector<int>& arr, int k, long long maxTime) {
        int painters = 1;
        long long currentSum = 0;

        for (int i = 0; i < arr.size(); i++) {
            
            if (currentSum + arr[i] <= maxTime) {
                currentSum += arr[i];
            } 
            else {
                painters++;
                currentSum = arr[i];

                if (painters > k)
                    return false;
            }
        }

        return true;
    }

    int minTime(vector<int>& arr, int k) {
        long long low = *max_element(arr.begin(), arr.end());
        long long high = accumulate(arr.begin(), arr.end(), 0LL);
        
        long long ans = high;

        while (low <= high) {
            long long mid = low + (high - low) / 2;

            if (isPossible(arr, k, mid)) {
                ans = mid;
                high = mid - 1;  
            } 
            else {
                low = mid + 1;   
            }
        }

        return ans;
    }
};