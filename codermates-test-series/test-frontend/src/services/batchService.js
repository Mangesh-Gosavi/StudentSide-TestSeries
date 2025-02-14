import API_BASE_URL from './config';

class BatchService {
static async createBatch(batchData) {
  const orgId = batchData.organization;
  
  try {
      const response = await fetch(
          `${API_BASE_URL}/user_management/organizations/${orgId}/batches/`, 
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(batchData),
          }
      );

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create batch');
      }

      return await response.json();
  } catch (error) {
      console.error("Error in batch creation:", error);
      throw error;
  }
}

  static async getBatchesForOrganization(organizationId, page = 1, limit = 10, search = "") {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search,
      }).toString();

      const response = await fetch(
        `${API_BASE_URL}/user_management/organizations/${organizationId}/batches/?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch batches');
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching batches:", error);
      throw error;
    }
  }

  static async getBatch(batchId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_management/batches/${batchId}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch batch');
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching batch:", error);
      throw error;
    }
  }

  static async updateBatch(batchId, batchData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_management/batches/${batchId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batchData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update batch');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating batch:', error);
      throw error;
    }
  }

  static async deleteBatch(batchId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_management/batches/${batchId}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete batch');
      }

      return true;
    } catch (error) {
      console.error('Error deleting batch:', error);
      throw error;
    }
  }
}

export default BatchService;