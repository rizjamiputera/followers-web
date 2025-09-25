import { defineStore } from 'pinia'

interface FollowState {
    followStatus: Record<string, boolean> // userId -> isFollowing
    isLoading: boolean
    isError: boolean
}

export const useFollowStore = defineStore('follow', {
    state: (): FollowState => ({
        followStatus: {},
        isLoading: false,
        isError: false
    }),

    getters: {
        isFollowing: (state) => (userId: string): boolean => {
            return state.followStatus[userId] || false;
        }
    },

    actions: {
        async follow(userId: string) {
            this.isLoading = true;
            this.isError = false;

            try {
                const response = await Api.post(`/v1/follow/${userId}`) as any;

                if (response) {
                    this.followStatus[userId] = true;
                    // return { success: true, message: response.message };
                    toastSuccess(response.message);
                    return;
                }
            } catch (error: any) {
                this.isError = true;
                const message = error?.response?.data?.message || 'Gagal mengikuti pengguna';
                return { success: false, message };
            } finally {
                this.isLoading = false;
            }
        },

        async unfollow(userId: string) {
            this.isLoading = true;
            this.isError = false;

            try {
                const response = await Api.remove(`/v1/follow/${userId}`) as any;

                if (response) {
                    this.followStatus[userId] = false;
                    toastWarning(response.message)
                    return;
                    // return { success: true, message: response.message };
                }
            } catch (error: any) {
                this.isError = true;
                const message = error?.response?.data?.message || 'Gagal berhenti mengikuti pengguna';
                return { success: false, message };
            } finally {
                this.isLoading = false;
            }
        },

        async checkFollowStatus(userId: string) {
            try {
                const response = await Api.get(`/v1/follow/status/${userId}`) as any;

                if (response) {
                    this.followStatus[userId] = response.isFollowing;
                    return response.isFollowing;
                }
                return false;
            } catch (error) {
                // If not authenticated or error, assume not following
                this.followStatus[userId] = false;
                return false;
            }
        },

        async toggleFollow(userId: string) {
            const isCurrentlyFollowing = this.followStatus[userId];

            if (isCurrentlyFollowing) {
                return await this.unfollow(userId);
            } else {
                return await this.follow(userId);
            }
        },

        // Batch check multiple users
        async checkMultipleFollowStatus(userIds: string[]) {
            const promises = userIds.map(userId => this.checkFollowStatus(userId));
            await Promise.all(promises);
        },

        // Reset state
        reset() {
            this.followStatus = {};
            this.isLoading = false;
            this.isError = false;
        }
    }
})
