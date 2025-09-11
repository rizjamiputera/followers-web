import { defineStore } from 'pinia'
import type { Tag, CreateTagDto, UpdateTagDto } from '~/interfaces/content-interface'

interface TagsStoreState {
    tags: Tag[]
    isLoading: boolean
    isError: boolean
    search: string
    // Form states
    isCreating: boolean
    isUpdating: boolean
    isDeleting: boolean
    // Modal states
    showCreateModal: boolean
    showEditModal: boolean
    showDeleteModal: boolean
    editingTag: Tag | null
    deletingTag: Tag | null
}

export const useTagsStore = defineStore('tags', {
    state: (): TagsStoreState => ({
        tags: [],
        isLoading: false,
        isError: false,
        search: '',
        // Form states
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        // Modal states
        showCreateModal: false,
        showEditModal: false,
        showDeleteModal: false,
        editingTag: null,
        deletingTag: null
    }),

    getters: {
        // Filtered tags based on search
        filteredTags: (state): Tag[] => {
            if (!state.search.trim()) {
                return state.tags
            }

            const query = state.search.toLowerCase()
            return state.tags.filter(tag =>
                tag.name.toLowerCase().includes(query) ||
                tag.slug.toLowerCase().includes(query)
            )
        },

        // Total tags count
        totalTags: (state): number => state.tags.length,

        // Check if there are any tags
        isEmpty: (state): boolean => state.tags.length === 0,

        // Check if any operation is in progress
        isAnyLoading: (state): boolean =>
            state.isLoading || state.isCreating || state.isUpdating || state.isDeleting,

        // Check if any modal is open
        isAnyModalOpen: (state): boolean =>
            state.showCreateModal || state.showEditModal || state.showDeleteModal
    },

    actions: {
        // Fetch all tags
        async get() {
            this.isLoading = true
            this.isError = false

            try {
                const data = await Api.get('/v1/tags') as Tag[]
                this.tags = data
            } catch (error) {
                console.error('Failed to fetch tags:', error)
                this.isError = true
                Api.handleError(error)
            } finally {
                this.isLoading = false
            }
        },

        // Create a new tag
        async create(tagData: CreateTagDto): Promise<boolean> {
            this.isCreating = true

            try {
                const newTag = await Api.post('/v1/tags', tagData) as Tag
                this.tags.unshift(newTag) // Add to beginning of array
                toastSuccess('Tag created successfully!')
                // this.closeCreateModal()
                return true
            } catch (error) {
                console.error('Failed to create tag:', error)
                toastError(error)
                return false
            } finally {
                this.isCreating = false
            }
        },

        // Update an existing tag
        async update(id: string, tagData: UpdateTagDto): Promise<boolean> {
            this.isUpdating = true

            try {
                const updatedTag = await Api.patch(`/v1/tags/${id}`, tagData) as Tag
                const index = this.tags.findIndex(tag => tag.id === id)
                if (index !== -1) {
                    this.tags[index] = updatedTag
                }
                toastSuccess('Tag updated successfully!')
                // this.closeEditModal()
                return true
            } catch (error) {
                console.error('Failed to update tag:', error)
                toastError(error)
                return false
            } finally {
                this.isUpdating = false
            }
        },

        // Delete a tag
        async remove(id: string): Promise<boolean> {
            this.isDeleting = true

            try {
                await Api.remove(`/v1/tags/${id}`)
                this.tags = this.tags.filter(tag => tag.id !== id)
                toastSuccess('Tag deleted successfully!')
                // this.closeDeleteModal()
                return true
            } catch (error) {
                console.error('Failed to delete tag:', error)
                toastError(error)
                return false
            } finally {
                this.isDeleting = false
            }
        },

        // Search tags (updates search filter)
        // setSearch(query: string) {
        //     this.search = query
        // },

        // // Modal management actions
        // openCreateModal() {
        //     this.showCreateModal = true
        // },

        // closeCreateModal() {
        //     this.showCreateModal = false
        // },

        // openEditModal(tag: Tag) {
        //     this.editingTag = { ...tag } // Create a copy
        //     this.showEditModal = true
        // },

        // closeEditModal() {
        //     this.showEditModal = false
        //     this.editingTag = null
        // },

        // openDeleteModal(tag: Tag) {
        //     this.deletingTag = tag
        //     this.showDeleteModal = true
        // },

        // closeDeleteModal() {
        //     this.showDeleteModal = false
        //     this.deletingTag = null
        // },

        // closeAllModals() {
        //     this.closeCreateModal()
        //     this.closeEditModal()
        //     this.closeDeleteModal()
        // },

        // Reset store state
        reset() {
            this.tags = []
            this.isLoading = false
            this.isError = false
            this.search = ''
            this.isCreating = false
            this.isUpdating = false
            this.isDeleting = false
            // this.closeAllModals()
        },

        // Get tag by ID (useful for getting fresh data)
        async getById(id: string): Promise<Tag | null> {
            try {
                const tag = await Api.get(`/v1/tags/${id}`) as Tag
                return tag
            } catch (error) {
                console.error('Failed to get tag:', error)
                Api.handleError(error)
                return null
            }
        },

        // Search tags via API (for autocomplete/typeahead)
        async find(query: string): Promise<Tag[]> {
            try {
                const tags = await Api.get(`/v1/tags/search?q=${encodeURIComponent(query)}`) as Tag[]
                return tags
            } catch (error) {
                console.error('Failed to search tags:', error)
                Api.handleError(error)
                return []
            }
        }
    }
})
