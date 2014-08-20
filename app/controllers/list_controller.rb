class ListController < ApplicationController
  def index 
    if params[:handle].nil? or params[:handle].blank?
      authenticate_user!
      @lists = List.where(:user_id => current_user.id)
    else
      @lists = List.where(:is_public => true).where('user_id IN (SELECT users.id FROM user WHERE handle = ?)', params[:handle])
    end
    @show_edit_ui = permit_edit
  end

  def update
    #TODO: raise an authentication error
    if permit_edit
      @list = List.find(params.require(:id))
      #is this a delete request?
      if params.has_key? :delete and params[:delete] == 'true'
        @list.destroy
        render :text => 'Deleted'
        return
      end
      #otherwise, it's an update
      @list.name = params[:name] if params[:name]
      if params.has_key? :'item-text'
        items = @list.items.to_a
        params[:'item-text'].each_with_index do |value,index|
          #save existing, add new
          if index < items.length
            item = items[index]
          else
            item = Item.new
            item.list_id = @list.id
          end
          item.text = value
          item.save
        end
        # delete any that are no longer needed
        if items.length > params[:'item-text'].length
          items.slice(params[:'item-text'].length, items.length).each{|i| i.destroy}
        end
      end
      @list.save
      render :text => 'Success'
    end
  end

  def create
    #TODO: raise an authentication error
    if permit_edit
      List.new do |list|
        list.name = 'New list'
        list.user_id = current_user.id
        list.save
      end
      redirect_to '/'
    end
  end

  private
    def permit_edit
      user_signed_in? and (params[:handle].nil? or params[:handle].blank? or current_user.handle == params[:handle])
    end
end
