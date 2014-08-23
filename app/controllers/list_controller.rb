class ListController < ApplicationController
  def index 
    if params[:handle].nil? or params[:handle].blank?
      authenticate_user!
      @lists = List.where(:user_id => current_user.id)
      @show_edit_ui = true
    else
      @lists = List.where(:is_public => true).where('user_id IN (SELECT users.id FROM users WHERE handle = ?)', params[:handle])
      @show_edit_ui = false
    end
  end

  def update
    @list = List.find(params.require(:id))
    if authenticate_user! and current_user.id == @list.user_id
      #is this a delete request?
      if params.has_key? :delete and params[:delete] == 'true'
        @list.destroy
        render :text => 'Deleted'
        return
      end
      #otherwise, it's an update
      @list.name = params[:name] if params[:name]
      @list.priority = params[:priority] if params[:priority]
      [:is_public, :is_in_parsed_mode].each do |key|
        @list[key] = params[key] == 'true'
      end

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
    else
      abort 'Bad permission!'
    end
  end

  def create
    if authenticate_user!
      List.new do |list|
        list.name = 'New list'
        list.user_id = current_user.id
        list.save
      end
      redirect_to '/'
    end
  end
end
