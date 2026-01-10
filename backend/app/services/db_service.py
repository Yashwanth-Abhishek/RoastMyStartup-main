import json
import logging
from datetime import datetime
from typing import Optional
from supabase import create_client, Client

from app.config.settings import settings
from app.schemas.roast import RoastRequest, RoastResponse

# Configure logging
logger = logging.getLogger(__name__)


class DatabaseService:
    """Service for persisting roast data to Supabase"""
    
    def __init__(self):
        """Initialize the Supabase client"""
        try:
            self.supabase: Client = create_client(
                settings.supabase_url,
                settings.supabase_key
            )
            logger.info("✅ Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Supabase client: {str(e)}")
            raise
    
    def save_roast(self, request: RoastRequest, response: RoastResponse) -> Optional[dict]:
        """
        Save a roast generation to the database
        
        Args:
            request: The original roast request
            response: The generated roast response
            
        Returns:
            dict: The inserted record if successful, None if failed
            
        Note:
            This method should not raise exceptions - it logs errors and returns None
            to ensure the user still receives their roast even if DB save fails.
        """
        try:
            # Prepare the data for insertion
            roast_data = {
                # Request fields
                "startup_name": request.startup_name,
                "idea_description": request.idea_description,
                "target_users": request.target_users,
                "budget": request.budget,
                "roast_level": request.roast_level,
                
                # Response fields
                "brutal_roast": response.brutal_roast,
                "honest_feedback": response.honest_feedback,
                "competitor_reality_check": response.competitor_reality_check,
                "survival_tips": response.survival_tips,  # This will be automatically converted to JSONB
                "pitch_rewrite": response.pitch_rewrite,
                
                # Metadata
                "created_at": datetime.utcnow().isoformat(),
            }
            
            logger.info(f"Saving roast to database for startup: {request.startup_name}")
            
            # Insert the record into the roasts table
            result = self.supabase.table("roasts").insert(roast_data).execute()
            
            if result.data:
                logger.info(f"✅ Successfully saved roast for {request.startup_name} to database")
                return result.data[0]
            else:
                logger.error(f"❌ No data returned from database insert for {request.startup_name}")
                return None
                
        except Exception as e:
            # Log the error but don't raise - this is fail-safe behavior
            logger.error(f"❌ Failed to save roast for {request.startup_name} to database: {str(e)}")
            logger.error(f"   Request data: startup_name={request.startup_name}, roast_level={request.roast_level}")
            return None
    
    def get_roast_stats(self) -> Optional[dict]:
        """
        Get basic statistics about roasts in the database
        
        Returns:
            dict: Statistics if successful, None if failed
        """
        try:
            # Get total count
            total_result = self.supabase.table("roasts").select("id", count="exact").execute()
            total_count = total_result.count if total_result.count is not None else 0
            
            # Get count by roast level
            level_stats = {}
            for level in ["Soft", "Medium", "Nuclear"]:
                level_result = self.supabase.table("roasts").select("id", count="exact").eq("roast_level", level).execute()
                level_stats[level] = level_result.count if level_result.count is not None else 0
            
            return {
                "total_roasts": total_count,
                "roast_levels": level_stats,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to get roast statistics: {str(e)}")
            return None
    
    def health_check(self) -> bool:
        """
        Check if the database connection is healthy
        
        Returns:
            bool: True if healthy, False otherwise
        """
        try:
            # Simple query to test connection
            result = self.supabase.table("roasts").select("id").limit(1).execute()
            return True
        except Exception as e:
            logger.error(f"❌ Database health check failed: {str(e)}")
            return False


# Global database service instance
db_service = DatabaseService()